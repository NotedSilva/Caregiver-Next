'use client';

import axios from 'axios';
import { FaFacebookF } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import  {signIn} from 'next-auth/react';
import { useCallback, useState } from 'react';
import { 
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';

import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';

import Modal from './modal';
import Heading from '../Heading';
import Input from '../inputs/input';
import toast from 'react-hot-toast';
import Button from '../Button';
import { useRouter } from 'next/navigation';


const LoginModal = () => {
    const router = useRouter();
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setisLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,

        }
    } =  useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit: SubmitHandler<FieldValues> =  (data) => {
        setisLoading(true);

        signIn('credentials', {
            ...data,
            redirect: false,
        })
        .then((callback) => {
            setisLoading(false);

            if (callback ?.ok ) {
                toast.success('Logado');
                router.refresh();
                loginModal.onClose();
            }

            if (callback?.error) {
                toast.error(callback.error);
            } 
        })
    } 

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title="Bem-vindo de volta"
                subtitle="Entrar na sua conta!"
                center
            />
            <Input
                id="email"
                label = "Email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="password"
                type="password"
                label = "Senha"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    );

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button 
                outline
                label="Continuar com Google"
                icon={FcGoogle}
                onClick={() => {}}
            />
            <Button 
                outline
                label="Continuar com Facebook"
                icon={FaFacebookF}
                onClick={() => {}}
            />
            <div 
        className="
          text-neutral-500 
          text-center 
          mt-4 
          font-light
        "
      >
        <p>Você já possui uma conta?
          <span
            onClick={registerModal.onClose}
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
            > Conecte-se</span>
        </p>
      </div>
    </div>
    )

    return(
        <Modal 
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title="Conecte-se"
            actionLabel="Continuar"
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
}

export default LoginModal;