import { useForm, type SubmitHandler } from 'react-hook-form';
import { type ContactFormData } from '../types/contact';

export const useFormHook = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit: SubmitHandler<ContactFormData> = (data) => {
    console.log('Form submitted:', data);
    reset();
  };

  return { register, handleSubmit, errors, onSubmit, reset };
};