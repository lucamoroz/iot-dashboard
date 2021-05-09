import React from 'react';

const CustomerContext = React.createContext({
    customer: { id: null, username: "Guest", email: "guest@guest.com", callsCount: null, role: "ROLE_CUSTOMER", plan: "FREE" },
    isLoggedIn: false,
    setCustomer: (customer) => {}, // Should be used by nested components on login, logout, ..
    setIsLoggedIn: (isLoggedIn) => {}
});

export default CustomerContext;