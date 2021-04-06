package it.unipd.webapp.devicemanagement.security;

import it.unipd.webapp.devicemanagement.model.Device;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class DeviceAuthenticationToken extends AbstractAuthenticationToken {
    private final Long deviceId;
    private final String token;
    private final Device device;

    DeviceAuthenticationToken(final Long deviceId, final String token) {
        super(null);

        this.deviceId = deviceId;
        this.token = token;
        this.device = null;

        setAuthenticated(false);
    }

    DeviceAuthenticationToken(final Long deviceId, final String token, final Collection<? extends GrantedAuthority> authorities, final Device device) {
        super(authorities);

        this.deviceId = deviceId;
        this.token = token;
        this.device = device;

        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return token;
    }

    @Override
    public Object getPrincipal() {
        return deviceId;
    }

    public Device getDevice() {
        return device;
    }
}
