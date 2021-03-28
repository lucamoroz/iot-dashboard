package it.unipd.webapp.devicemanagement.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class DeviceAuthenticationProvider implements AuthenticationProvider {
    @Override
    public Authentication authenticate(Authentication auth) throws AuthenticationException {
        // TODO this authentication provider will retrieve the device ID given a token.
        // The request will be authenticated if the token is associated with a device

        final DeviceAuthenticationToken authenticationToken = (DeviceAuthenticationToken) auth;
        String token = auth.getCredentials().toString();

        log.debug(String.format("retrieving device for token: %s", token));
        String deviceId = "device_id"; // device_id = findDeviceIdByToken(token)

        if (deviceId == null || !token.equals("123")) { // todo remove the token equals once findDeviceIdByToken(token) is available
            log.debug(String.format("device with token %s not found", token));
            throw new BadCredentialsException(String.format("Device with token %s not found!", token));
        }

        DeviceAuthenticationToken authenticatedDevice = new DeviceAuthenticationToken(
                deviceId,
                token,
                List.of(new SimpleGrantedAuthority("ROLE_DEVICE")
        ));

        authenticatedDevice.setDetails(authenticationToken.getDetails());

        log.debug(String.format("authenticated device: %s", deviceId));
        return authenticatedDevice;
    }

    @Override
    public boolean supports(Class<?> auth) {
        return auth.equals(DeviceAuthenticationToken.class);
    }
}