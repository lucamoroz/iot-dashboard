package it.unipd.webapp.configuration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
@Slf4j
public class CustomAuthenticationProvider implements AuthenticationProvider {
    @Override
    public Authentication authenticate(Authentication auth) throws AuthenticationException {
        // TODO this authentication provider will retrieve the device ID given a token.
        // The request will be authenticated if the token is associated with a device

        String token = auth.getCredentials().toString();
        String device_id = "device_id"; // username = findDeviceIdByToken(token)

        log.info(String.format("Custom auth provider checking credentials for usr: %s, pass: %s", device_id, token));

        if (device_id == null || !token.equals("123")) { // todo remove the token equals once findDeviceIdByToken(token) is available
            throw new BadCredentialsException("External system authentication failed");
        }

        return new UsernamePasswordAuthenticationToken(
                device_id,
                token,
                List.of(new SimpleGrantedAuthority("ROLE_DEVICE"))
        );
    }

    @Override
    public boolean supports(Class<?> auth) {
        return auth.equals(UsernamePasswordAuthenticationToken.class);
    }
}