import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ChatBot from '../Components/ChatBot';
import ScrollToTop from '../Components/ScrollToTop';
import ContactModal from '../Components/ContactModal';

const MainLayout = () => {
    // const { pathname } = useLocation();
    // const shouldShowChat = !pathname.startsWith('/chat-ai') && !pathname.startsWith('/admin');

    return (
        <>
            <ScrollToTop />
            <Outlet />
            {/* {shouldShowChat && <ChatBot />} */}
            <ContactModal />
        </>
    );
};

export default MainLayout;
