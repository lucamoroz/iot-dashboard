package it.unipd.webapp.devicemanagement.security;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import it.unipd.webapp.devicemanagement.model.Device;
import it.unipd.webapp.devicemanagement.repository.DeviceRepository;

import java.util.List;

@Component
@Slf4j
public class DeviceAuthenticationProvider implements AuthenticationProvider {

    @Autowired
    private DeviceRepository deviceRepo;

    @Override
    public Authentication authenticate(Authentication auth) throws AuthenticationException {

        final DeviceAuthenticationToken authenticationToken = (DeviceAuthenticationToken) auth;
        String token = auth.getCredentials().toString();

        log.debug(String.format("retrieving device for token: %s", token));
        
        Device device = deviceRepo.findDeviceByToken(token).orElseThrow(
            () -> new BadCredentialsException(String.format("Device with token %s not found!", token))
        );

        String deviceId = Long.toString(device.getId());

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