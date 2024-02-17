'use client';

import axios from 'axios';
import { FaFacebookF } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useCallback, useState } from 'react';
import { 
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';

import useRegisterModal from '@/app/hooks/useRegisterModal';
import Modal from './modal';
import Heading from '../Heading';
import Input from '../inputs/input';
import toast from 'react-hot-toast';
import Button from '../Button';


const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const [isLoading, setisLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,

        }
    } =  useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> =  (data) => {
        setisLoading(true);

        axios.post('/api/register', data)
        .then(() => {
            registerModal.onClose();
        })
        .catch((error) =>{
            toast.error('Algo está errado.');
        })
        .finally(() => {
            setisLoading(false);
        })
    } 

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title="Bem-vindo ao Caregiver"
                subtitle="Crie a sua conta!"
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
                id="name"
                label = "Nome"
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
            isOpen={registerModal.isOpen}
            title="Cadastrar-se"
            actionLabel="Continue"
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
}

export default RegisterModal;