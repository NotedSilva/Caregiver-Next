'use client';
import { useMemo, useState } from "react";
import useRentModal from "@/app/hooks/useRentModal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import CategoryInput from "../inputs/CategoryInput";
import Heading from "../Heading";
import Modal from "./modal";
import { categories } from "../navbar/Categories";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/input";

import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5,
}

const RentModal = () => {
    const router = useRouter();
    const rentModal = useRentModal();

    const [step, setStep] = useState(STEPS.CATEGORY);
    const [isLoading, setIsLoading] = useState(false);

    const { 
        register, 
        handleSubmit,
        setValue,
        watch,
        formState: {
          errors,
        },
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: null,
            experienceCount: 1,
            timeCount: 1,
            dependentCount: 1,
            imageSrc: '',
            price: 1,
            title: '',
            description: ''
        }
    });

    const category = watch('category');
    const location = watch('location');
    const timeCount = watch('timeCount');
    const experienceCount = watch('experienceCount');
    const dependentCount = watch('dependentCount');
    const imageSrc = watch('imageSrc');

    const Map = useMemo(() => dynamic(() => import('../Map'), { 
      ssr: false 
    }), [location]);

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true
        })
      }

      const onBack = () => {
        setStep((value) => value - 1);
      }
    
      const onNext = () => {
        setStep((value) => value + 1);
      }

      const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step != STEPS.PRICE) {
          return onNext();
        }

        setIsLoading(true);

        axios.post('/api/listings', data)
        .then(() => {
          toast.success('Listing Created!');
          router.refresh();
          reset();
          setStep(STEPS.CATEGORY);
          rentModal.onClose();
        })
        .catch(() => {
          toast.error('Algo deu errado!');
        }).finally(() => {
          setIsLoading(false);
        })

      }

      const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
          return 'Create'
        }
    
        return 'Próximo'
      }, [step]);
    
      const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
          return undefined
        }
    
        return 'Voltar'
      }, [step]);

      let bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading
            title="Qual destas opções melhor descreve seus cuidados?"
            subtitle="Escolha uma categoria"
          />
          <div 
            className="
              grid 
              grid-cols-1 
              md:grid-cols-2 
              gap-3
              max-h-[50vh]
              overflow-y-auto
            "
          >
            {categories.map((item) => (
              <div key={item.label} className="col-span-1">
                <CategoryInput
                  onClick={(category) => 
                    setCustomValue('category', category)}
                  selected={category === item.label}
                  label={item.label}
                  icon={item.icon}
                />
              </div>
            ))}
          </div>
        </div>
      )

      if (step === STEPS.LOCATION) {
        bodyContent = (
          <div className=" flex flex-col gap-8">
            <Heading
              title="Qual é a sua localização?"
              subtitle="Ajude os usuários a te encontrar!"
            />
            <CountrySelect
            value={location}
              onChange={(value) => setCustomValue('location', value)}
            />
            <Map center={location?.latlng} />
          </div>
        )
      }

      if (step === STEPS.INFO) {
        bodyContent = (
          <div className=" flex flex-col gap-8">
            <Heading
              title="Conte-me um pouco sobre você"
              subtitle="Suas informações!"
            />
            <hr/>
            <Counter
              title="Disponibilidade de tempo"
              subtitle="Quantas horas por dia você está disponível para trabalhar como cuidador?"
              value={timeCount}
              onChange={(value) => setCustomValue('timeCount', value)}
            />
             <hr/>
            <Counter
              title="Experiência prévia"
              subtitle="Quantos anos de experiência você possui como cuidador?"
              value={experienceCount}
              onChange={(value) => setCustomValue('experienceCount', value)}
            />
             <hr/>
            <Counter
              title="Beneficiários"
              subtitle="Número de beneficiários?"
              value={dependentCount}
              onChange={(value) => setCustomValue('dependentCount', value)}
            />
          </div>
        )
      }

      if (step === STEPS.IMAGES) {
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading
              title="Adicione uma foto sua"
              subtitle=""
            />
            <ImageUpload
              value={imageSrc}
              onChange={(value) => setCustomValue('imageSrc', value)}
            />
          </div>
        )
      }

      if (step === STEPS.DESCRIPTION) {
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading 
              title="Sobre você!"
              subtitle=""
            />
            <Input
              id="title"
              label="Seu nome"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
            <hr />
            <Input
              id="age"
              label="Idade"
              type="number"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              />
              <hr />
            <Input
              id="description"
              label="Descrição"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
          </div>
        )
      }

      if (step === STEPS.PRICE) {
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading
              title="Agora, informe seus detalhes de valor"
              subtitle="Qual o seu valor por hora?"
            />
            <Input
              id="price"
              label="Preço"
              formatPrice="$"
              type="number"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
          </div>
        )
      }
      
    return (
        <Modal
            isOpen={rentModal.isOpen}
            title="Anuncie seu perfil no Caregiver"
            actionLabel={actionLabel}
            onSubmit={handleSubmit(onSubmit)}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            onClose={rentModal.onClose}
            body={bodyContent}
        />
    )
}

export default RentModal;