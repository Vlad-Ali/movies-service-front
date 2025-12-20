const handleAuthError = () => {
    console.log('🔒 Auth error detected, logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    window.dispatchEvent(new CustomEvent('auth-error'));
};

export const authFetch = async (input: RequestInfo, init?: RequestInit) => {

    const config: RequestInit = {
        ...init,
    };

    const response = await fetch(input, config);

    if (response.status === 401) {
        handleAuthError();

        throw new Error('Authentication required');
    }

    return response;
};