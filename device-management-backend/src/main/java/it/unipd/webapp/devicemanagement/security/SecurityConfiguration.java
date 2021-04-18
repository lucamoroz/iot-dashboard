package it.unipd.webapp.devicemanagement.security;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.unipd.webapp.devicemanagement.exception.CustomErrorResponse;
import it.unipd.webapp.devicemanagement.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.session.NullAuthenticatedSessionStrategy;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;

@Configuration
@EnableWebSecurity
@Slf4j
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    final RequestMatcher DEVICE_API_MATCHER = new OrRequestMatcher(new AntPathRequestMatcher("/device/**"));

    @Autowired
    UserDetailsService userDetailsService;

    @Autowired
    DeviceAuthenticationProvider deviceAuthenticationProvider;

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http
                .requestCache().disable()
                .httpBasic().and() // TODO remove this later - it helps for quicker testing (no need to set jsession cookie)
                .addFilterBefore(createDeviceAuthenticationFilter(DEVICE_API_MATCHER), AnonymousAuthenticationFilter.class)
                .authorizeRequests()
                    .antMatchers("/", "/customer/register").permitAll()
                    .anyRequest().authenticated()
                    .and()
                .exceptionHandling()
                    .authenticationEntryPoint(this::authFailureHandler)
                    .accessDeniedHandler(this::accessDeniedHandler)
                    .and()
                .formLogin()
                    .loginProcessingUrl("/customer/login") // authentication url
                    .usernameParameter("username") // name of request parameter used to retrieve username
                    .passwordParameter("password") // name of request parameter used to retrieve password
                    .successHandler(this::loginSuccessHandler)
                    .failureHandler(this::loginFailureHandler)
                    .and()
                .sessionManagement().and()
                .logout()
                    .logoutUrl("/customer/logout")
                    .logoutSuccessHandler(this::logoutSuccessHandler)
                    .invalidateHttpSession(true) // invalidate session on logout
                    .and()
                .csrf().disable(); // TODO enable CSRF protection later (doesn't work with postman)
    }

    @Override
    public void configure(AuthenticationManagerBuilder builder) throws Exception {
        // Add authentication with a custom authentication provider
        builder.authenticationProvider(deviceAuthenticationProvider);
        // Add authentication with a custom user details service
        builder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    private DeviceAuthenticationFilter createDeviceAuthenticationFilter(RequestMatcher protectedMatcher) throws Exception {

        final DeviceAuthenticationFilter filter = new DeviceAuthenticationFilter(protectedMatcher);
        filter.setAuthenticationManager(authenticationManager());

        SimpleUrlAuthenticationSuccessHandler successHandler = new SimpleUrlAuthenticationSuccessHandler();
        successHandler.setRedirectStrategy(new NoRedirectStrategy());
        filter.setAuthenticationSuccessHandler(successHandler);
        filter.setAuthenticationFailureHandler(this::deviceAuthFailureHandler);
        return filter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private void sendErrorResponse(HttpServletResponse response, HttpStatus status, CustomErrorResponse error)
            throws IOException {
        var mapper = new ObjectMapper();
        mapper.setDefaultPropertyInclusion(JsonInclude.Include.NON_NULL);
        var jsonError = mapper.writeValueAsString(error);

        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().print(jsonError);
        response.getWriter().flush();
    }

    private void loginSuccessHandler(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) {
        log.debug(String.format("Authenticated: %s with ID %s", authentication.getName(), request.getSession().getId()));
        response.setStatus(HttpStatus.OK.value());
    }

    private void logoutSuccessHandler(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) {
        log.debug(String.format("logout for user %s", authentication.getName()));
        response.setStatus(HttpStatus.OK.value());
    }

    private void deviceAuthFailureHandler(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException e) throws IOException {
        log.debug(String.format("Device auth failure: %s", e.getMessage()));

        var errorMessage = CustomErrorResponse.builder()
                .errorCode(ErrorCode.EAUT1)
                .reason("Bad request")
                .description("Invalid device authentication")
                .status(HttpStatus.UNAUTHORIZED.value())
                .build();

        sendErrorResponse(response, HttpStatus.UNAUTHORIZED, errorMessage);
    }

    private void authFailureHandler(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException e) throws IOException {
        log.debug(String.format("Authentication failure: %s", e.getMessage()));

        var errorMessage = CustomErrorResponse.builder()
                .errorCode(ErrorCode.EAUT2)
                .reason("Bad request")
                .description("Invalid customer authentication")
                .status(HttpStatus.UNAUTHORIZED.value())
                .build();

        sendErrorResponse(response, HttpStatus.UNAUTHORIZED, errorMessage);
    }

    void accessDeniedHandler(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException) throws IOException {

        log.debug(String.format("Access denied error: %s", accessDeniedException.getMessage()));

        var errorMessage = CustomErrorResponse.builder()
                .errorCode(ErrorCode.EAUT3)
                .reason("Access denied")
                .description(accessDeniedException.getMessage())
                .status(HttpStatus.UNAUTHORIZED.value())
                .build();

        sendErrorResponse(response, HttpStatus.UNAUTHORIZED, errorMessage);
    }

    private void loginFailureHandler(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException e) throws IOException {
        log.debug(String.format("Authentication failure: %s", e.getMessage()));

        var errorMessage = CustomErrorResponse.builder()
                .errorCode(ErrorCode.ELOG1)
                .reason("Bad request")
                .description("Invalid login operation")
                .status(HttpStatus.UNAUTHORIZED.value())
                .build();

        sendErrorResponse(response, HttpStatus.UNAUTHORIZED, errorMessage);
    }
}