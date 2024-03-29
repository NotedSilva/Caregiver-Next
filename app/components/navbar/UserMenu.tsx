'use client';

import { AiOutlineMenu } from "react-icons/ai";
import { signOut } from "next-auth/react";
import { useCallback, useState } from "react";

import MenuItem from "./MenuItem";
import Avatar from "../Avatar";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRentModal from "@/app/hooks/useRentModal";
import { SafeUser } from "@/app/types";

interface UserMenuProps {
    currentUser?: SafeUser | null
  }
  
  const UserMenu: React.FC<UserMenuProps> = ({
    currentUser
  }) => {
  
      const registerModal = useRegisterModal();
      const loginModal = useLoginModal();
      const rentModal = useRentModal();
  
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleOpen = useCallback(() => {
      setIsOpen((value) => !value);
    }, []);

    const onRent = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen();
        }

        rentModal.onOpen();
    }, [currentUser, loginModal, rentModal]);


    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div
                    onClick={onRent}
                    className="
                        hidden
                        md:block
                        text-sm
                        font-semibold
                        py-3
                        px-4
                        rounded-full
                        hover:bg-neutral-100
                        transition
                        cursor-pointer
                    "
                >
                    Anuncie seu perfil no Caregiver
                </div>
                <div
                    onClick={toggleOpen}
                    className="
                        p-4
                        md:py-1
                        md:px-2
                        border-[1px]
                        border-neutral-200
                        flex
                        flex-row
                        items-center
                        gap-3
                        rounded-full
                        cursor-pointer
                        hover:shadow-md
                        transition
                    "
                >
                    <AiOutlineMenu />
                    <div className="hidden md:block">
                        <Avatar src={currentUser?.image} />

                    </div>
                </div>
            </div>

            {isOpen &&(
                <div
                    className="
                        absolute
                        rounded-xl
                        shadow-md
                        w-[40vw]
                        md:w-3/4
                        bg-white
                        overflow-hidden
                        right-0
                        top-12
                        text-sm
                    "   
                >
                    <div className="flex flex-col cursor-pointer">
                            {currentUser ? (
                                <>
                                <MenuItem
                                    onClick={() => {}}
                                    label="Meus Cuidadores"
                                />
                                <MenuItem
                                    onClick={() => {}}
                                    label="Meus Favoritos"
                                />
                                <MenuItem
                                    onClick={() => {}}
                                    label="Minhas Solicitações"
                                />
                                <MenuItem
                                    onClick={() => {}}
                                    label="Serviços Feitos"
                                />
                                <MenuItem
                                    onClick={rentModal.onOpen}
                                    label="Perfil no Caregiver"
                                />
                                <hr/>
                                <MenuItem
                                    onClick={() => signOut()}
                                    label="Sair"
                                />
                            </>
                            ) : (
                        <>
                            <MenuItem
                                onClick={loginModal.onOpen}
                                label="Entrar"
                            />
                            <MenuItem
                                onClick={registerModal.onOpen}
                                label="Cadastrar-se"
                            />
                        </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserMenu;