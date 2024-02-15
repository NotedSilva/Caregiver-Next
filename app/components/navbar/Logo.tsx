'use client';

import { useRouter } from "next/navigation";

const Logo = () => {
    const Router = useRouter();

    return(
        <div
        className="hidden md:block cursor-pointer"
        onClick={() => Router.push("/")}
    >
        <span className="text-4xl font-bold text-amber-600">Caregiver</span>
    </div>
    );
}

export default Logo;