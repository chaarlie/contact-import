import React from 'react';
import { Redirect, Route } from 'react-router-dom';

function ProtectedRoute({ path, isAuthenticated, component: Component, ...rest }) {
    return <Route path={path} render={(props)=> {
        if (isAuthenticated) {
            return <Component {...rest} />
        }
        return <Redirect to='/' />;
    }} />
}

export default ProtectedRoute
