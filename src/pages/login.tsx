// Página de login

import React from "react";
import AuthLayout from "../components/layout/AuthLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "./login.schema";
import { useAuthStore } from "../state/auth.store";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function LoginPage() {
  const { login, loading, error, token } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  React.useEffect(() => {
    if (token) navigate("/spaces");
  }, [token, navigate]);

  const onSubmit = async (data: LoginFormValues) => {
    await login(data.email, data.password);
  };

  return (
    <AuthLayout>
      <form
        className="login-form flex flex-col gap-4"
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
          Entrar
        </Button>
      </form>
    </AuthLayout>
  );
}
