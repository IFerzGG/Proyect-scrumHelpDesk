import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { getLoginError, login } from '../services/auth';
import { loginSchema, type LoginFormValues } from '../schemas/loginSchema';
import { useAuthStore } from '../store/useAuthStore';

function Brand({ light = false }: { light?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 ${light ? 'text-white' : 'text-slate-900'}`}
    >
      <div className="grid size-10 place-items-center rounded-xl bg-teal-500 text-white shadow-lg shadow-teal-900/15">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-5"
          aria-hidden="true"
        >
          <path
            d="M4.5 12.5 9 17l10.5-10"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 2.8a9.2 9.2 0 1 0 9.2 9.2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="text-xl font-bold tracking-tight">helpdesk</span>
    </div>
  );
}

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 5.2A10.7 10.7 0 0 1 12 5c5.2 0 8.7 4.1 9.8 6.2a1.8 1.8 0 0 1 0 1.6 13 13 0 0 1-3.1 3.8M6.2 6.3a13.6 13.6 0 0 0-4 4.9 1.8 1.8 0 0 0 0 1.6C3.3 14.9 6.8 19 12 19c.9 0 1.8-.1 2.6-.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
      <path
        d="M2.2 12s3.5-7 9.8-7 9.8 7 9.8 7-3.5 7-9.8 7-9.8-7-9.8-7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [requestError, setRequestError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const iniciarSesion = useAuthStore((state) => state.iniciarSesion);

  const onSubmit = async (values: LoginFormValues) => {
    setRequestError('');

    try {
      const { access_token, usuario } = await login(values);

      iniciarSesion(access_token, usuario);

      navigate('/dashboard', { replace: true });
    } catch (error) {
      setRequestError(getLoginError(error));
    }
  };

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-[minmax(420px,0.92fr)_1.08fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-slate-950 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
        <div className="absolute -left-40 top-36 size-[28rem] rounded-full bg-teal-500/15 blur-3xl" />
        <div className="absolute -bottom-40 right-0 size-[30rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative">
          <Brand light />
        </div>

        <div className="relative max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-teal-200">
            <span className="size-1.5 rounded-full bg-teal-400" />
            Centro de soporte interno
          </div>
          <h1 className="max-w-lg text-5xl font-semibold leading-[1.12] tracking-tight xl:text-6xl">
            Resolver juntos,
            <span className="block text-teal-300">trabajar mejor.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
            Un solo lugar para organizar solicitudes, colaborar con tu equipo y
            mantener cada incidencia en movimiento.
          </p>

          <div className="mt-12 max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-200">
                  Tu equipo, en sintonía
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Las solicitudes bajo control
                </p>
              </div>
              <div className="flex -space-x-2">
                {['bg-teal-400', 'bg-indigo-400', 'bg-amber-400'].map(
                  (color, index) => (
                    <div
                      key={color}
                      className={`grid size-8 place-items-center rounded-full border-2 border-slate-900 ${color} text-[10px] font-bold text-slate-950`}
                    >
                      {['A', 'M', 'J'][index]}
                    </div>
                  ),
                )}
                <div className="grid size-8 place-items-center rounded-full border-2 border-slate-900 bg-slate-700 text-[10px] font-medium text-white">
                  +4
                </div>
              </div>
            </div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300" />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-slate-500">
              <span>Seguimiento del equipo</span>
              <span>75%</span>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-slate-500">
          © 2026 Helpdesk · Soporte que avanza
        </p>
      </section>

      <section className="flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:px-14 xl:px-24">
        <div className="lg:hidden">
          <Brand />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <div className="mb-10">
            <p className="text-sm font-semibold text-teal-700">
              Qué bueno verte
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Inicia sesión
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Ingresa tus datos para continuar a tu espacio de trabajo.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="nombre@empresa.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 aria-invalid:border-rose-400"
                {...register('email')}
              />
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-xs text-rose-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Contraseña
                </label>
                <span className="text-xs text-slate-400">
                  Mínimo 6 caracteres
                </span>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={passwordVisible ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? 'password-error' : undefined
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 aria-invalid:border-rose-400"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible((visible) => !visible)}
                  aria-label={
                    passwordVisible
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  }
                  className="absolute inset-y-0 right-0 grid w-12 place-items-center text-slate-400 transition hover:text-slate-700"
                >
                  <EyeIcon visible={passwordVisible} />
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1.5 text-xs text-rose-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {requestError && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              >
                {requestError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/15 transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500/20 disabled:cursor-wait disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Validando acceso…
                </>
              ) : (
                <>
                  Entrar a mi cuenta
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="size-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 10h12m-5-5 5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-3 text-xs text-slate-400">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="size-4 shrink-0"
              aria-hidden="true"
            >
              <path
                d="M5.5 8V6a4.5 4.5 0 0 1 9 0v2m-10 0h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            Tu sesión está protegida con autenticación segura.
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 lg:text-right">
          ¿Tienes problemas para acceder? Contacta a tu administrador.
        </p>
      </section>
    </main>
  );
}
