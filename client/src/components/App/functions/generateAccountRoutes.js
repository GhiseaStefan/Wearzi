import { Route, Navigate } from 'react-router-dom'

import Account from '../../User/Account';
import IntelligentSuggestion from '../../IntelligentSuggestion/IntelligentSuggestion';

const generateAccountRoutes = (loggedIn, loading, user) => {
    if (loggedIn) {
        return (
            <>
                <Route path='/account/*' element={<Account user={user} />} />
                <Route path='/intelligentSuggestion' element={<IntelligentSuggestion />} />
            </>
        );
    } else if (!loading) {
        return (
            <>
                <Route path='/account/*' element={<Navigate replace to='/login' />} />
                <Route path='/intelligentSuggestion' element={<Navigate replace to='/login' />} />
            </>
        );
    }
    return null;
};

export default generateAccountRoutes;