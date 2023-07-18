"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ConfirmEmail from "./components/ConfirmEmail";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RegisterSchema, registerSchema } from "@/types/register/formSchema";
import { motion } from "framer-motion";
import supabase from "@/lib/supabase";
import { AiOutlineLoading } from "react-icons/ai";
import EmailInput from "@/shared/components/forms/EmailInput";
import GoBackLink from "@/shared/components/forms/GoBackLink";
import HeroInfo from "@/shared/components/forms/HeroInfo";
import PassInput from "@/shared/components/forms/PassInput";
import FormActions from "@/shared/components/forms/FormActions";

const schema: yup.ObjectSchema<RegisterSchema> = yup
  .object()
  .shape(registerSchema);

export default function RegisterPage() {
  const [formSent, setFormSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleRegisterForm = async (data: RegisterSchema) => {
    setLoading(true);
    const { email, password } = data;
    if (!email || !password) {
      console.log("error");
      return;
    }

    const { data: registerData, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
    });
    if (error) {
      console.log(error);
    }

    if (registerData) {
      console.log(registerData);
      setLoading(false);
      setFormSent(true);
    }
  };

  if (formSent) {
    return <ConfirmEmail />;
  }

  return (
    <main>
      <section className="bg-black min-h-screen flex flex-col items-center pt-5">
        <GoBackLink />
        <HeroInfo
          loading={loading}
          image={"/assets/register/float_logo.svg"}
          title="Boom shakalaka! Vamos a empezar."
          subtitle="Para empezar, necesitamos un nombre y correo electrónico."
        />
        <form
          className="pt-4 flex flex-col items-center gap-8"
          onSubmit={handleSubmit(handleRegisterForm)}
        >
          {loading ? (
            <motion.div
              className="text-4xl animate-spin transition"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <AiOutlineLoading />
            </motion.div>
          ) : (
            <>
              <EmailInput register={register} />
              <PassInput register={register} />
              {(errors.email || errors.password) && (
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className="max-w-xs"
                >
                  <p className="text-red-500 text-center w-fit mx-auto">
                    {errors.email?.message || errors.password?.message}
                  </p>
                </motion.div>
              )}
            </>
          )}
          <FormActions loading={loading} />
        </form>
      </section>
    </main>
  );
}