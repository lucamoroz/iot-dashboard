package it.unipd.webapp.devicemanagement.configuration;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class DeviceAuthenticationToken extends AbstractAuthenticationToken {
    private final String deviceId;
    private final String token;

    DeviceAuthenticationToken(final String deviceId, final String token) {
        super(null);

        this.deviceId = deviceId;
        this.token = token;

        setAuthenticated(false);
    }

    DeviceAuthenticationToken(final String deviceId, final String token, final Collection<? extends GrantedAuthority> authorities) {
        super(authorities);

        this.deviceId = deviceId;
        this.token = token;

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
}
