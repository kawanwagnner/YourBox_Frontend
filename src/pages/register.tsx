// Página de registro

import React from "react";
import AuthLayout from "../components/layout/AuthLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormValues } from "./register.schema";
import { useAuthStore } from "../state/auth.store";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function RegisterPage() {
  const { loading, error, token } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  React.useEffect(() => {
    if (token) navigate("/spaces");
  }, [token, navigate]);

  const onSubmit = async (data: RegisterFormValues) => {
    // Chama endpoint de registro e faz login automático
    try {
      await useAuthStore.getState().logout(); // Garante que não há token
      await useAuthStore.getState().login(data.email, data.password);
    } catch {}
  };

  return (
    <AuthLayout>
      <form
        className="register-form flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          type="email"
          placeholder="E-mail"
          {...register("email")}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}
        <Input
          type="password"
          placeholder="Senha"
          {...register("password")}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}
        {error && <span className="text-red-500 text-sm">{error}</span>}
        <Button type="submit" loading={loading}>
          Registrar
        </Button>
      </form>
    </AuthLayout>
  );
}
