import { useAuth } from "@clerk/clerk-react"
import { useState, useEffect } from "react"
import { axiosInstance } from "../lib/axios"
import { Loader } from "lucide-react";

const updateApiToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
}

const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const { getToken, isLoaded } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {       
            if (!isLoaded) return;
            try {
                const token = await getToken();
                updateApiToken(token);
            } catch (error) { 
                updateApiToken(null);
                console.error("Error initializing auth:", error);
            } finally {
                setLoading(false);
            }
        }

        initAuth()
    }, [getToken, isLoaded])

    if (loading || !isLoaded) {
        return (
            <div className="h-screen w-full bg-[#121212] flex items-center justify-center">
                <Loader className="size-8 text-blue-500 animate-spin"/>
            </div>
        )
    }

    return <>{children}</>
}

export default AuthProvider