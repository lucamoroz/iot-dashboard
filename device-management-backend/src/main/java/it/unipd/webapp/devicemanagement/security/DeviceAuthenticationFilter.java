package it.unipd.webapp.devicemanagement.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.RequestMatcher;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;

import static java.util.Optional.ofNullable;

@Slf4j
final class DeviceAuthenticationFilter extends AbstractAuthenticationProcessingFilter {

    private static final String BEARER = "Bearer";
    private static final String AUTHORIZATION = "Authorization";

    DeviceAuthenticationFilter(final RequestMatcher requiresAuth) {
        super(requiresAuth);
    }

    @Override
    public Authentication attemptAuthentication(final HttpServletRequest request, final HttpServletResponse response) {
        // Extract token from Authorization header
        final String param = ofNullable(request.getHeader(AUTHORIZATION))
                .orElseThrow(() -> new BadCredentialsException("Missing Authorization header"));

        log.debug("received request with authorization value: " + param);

        final String token = ofNullable(param)
                .map(value -> value.replace(BEARER, ""))
                .map(String::trim)
                .orElseThrow(() -> new BadCredentialsException("Missing Authentication Token"));

        final DeviceAuthenticationToken authenticationToken = new DeviceAuthenticationToken(null, token);
        authenticationToken.setDetails(authenticationDetailsSource.buildDetails(request));

        // Delegate authentication to the authentication manager
        return getAuthenticationManager().authenticate(authenticationToken);
    }

    @Override
    protected void successfulAuthentication(
            final HttpServletRequest request,
            final HttpServletResponse response,
            final FilterChain chain,
            final Authentication authResult) throws IOException, ServletException {
        super.successfulAuthentication(request, response, chain, authResult);
        // No session for devices
        request.getSession().invalidate();
        // Let the request reach the application if the request is authenticated
        chain.doFilter(request, response);
    }
}