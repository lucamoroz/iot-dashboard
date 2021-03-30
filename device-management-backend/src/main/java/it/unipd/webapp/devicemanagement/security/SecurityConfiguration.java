package it.unipd.webapp.devicemanagement.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    final RequestMatcher DEVICE_API_MATCHER = new OrRequestMatcher(new AntPathRequestMatcher("/device/**"));

    @Autowired
    UserDetailsService userDetailsService;

    @Autowired
    DeviceAuthenticationProvider deviceAuthenticationProvider;

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http
                .httpBasic()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.NEVER)
                .and()
                .addFilterBefore(createDeviceAuthenticationFilter(DEVICE_API_MATCHER), AnonymousAuthenticationFilter.class)
                .authorizeRequests()
                    .antMatchers("/", "/customer/register").permitAll()
                    .anyRequest().authenticated()
                    .and()
                .formLogin()
                    .permitAll()
                    .and()
                .logout()
                    .permitAll()
                .and().csrf().disable(); // TODO enable CSRF protection later (doesn't work with postman)
    }

    @Override
    public void configure(AuthenticationManagerBuilder builder) throws Exception {
        // Add authentication with a custom authentication provider
        builder.authenticationProvider(deviceAuthenticationProvider);
        // Add authentication with a custom user details service
        builder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    DeviceAuthenticationFilter createDeviceAuthenticationFilter(RequestMatcher protectedMatcher) throws Exception {

        final DeviceAuthenticationFilter filter = new DeviceAuthenticationFilter(protectedMatcher);
        filter.setAuthenticationManager(authenticationManager());

        SimpleUrlAuthenticationSuccessHandler successHandler = new SimpleUrlAuthenticationSuccessHandler();
        successHandler.setRedirectStrategy(new NoRedirectStrategy());

        filter.setAuthenticationSuccessHandler(successHandler);
        return filter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}