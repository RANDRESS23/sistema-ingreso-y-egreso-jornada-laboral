"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Clock, User, Play, BarChart3, Shield, TrendingUp } from "lucide-react";

export default function Home() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingActive, setIsCheckingActive] = useState(true);
  const router = useRouter();

  // Verificar si hay jornada activa al cargar la página
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        // Intentar obtener el último código usado del localStorage
        const lastCode = localStorage.getItem("lastWorkCode");

        if (lastCode) {
          const res = await fetch(`/api/active/${lastCode}`);

          if (res.ok) {
            const data = await res.json();
            if (data.active) {
              toast.info("Se encontró una jornada activa");
              router.push(`/jornada?code=${lastCode}`);
              return;
            }
          }
        }
      } catch (error) {
        console.error("Error verificando jornada activa:", error);
      } finally {
        setIsCheckingActive(false);
      }
    };

    checkActiveSession();
  }, [router]);

  const startDay = async () => {
    if (!code.trim()) {
      toast.error("Por favor ingresa tu código de trabajador");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error al iniciar jornada");
        return;
      }

      // Guardar el código en localStorage para futuras verificaciones
      localStorage.setItem("lastWorkCode", code.trim());

      toast.success("¡Jornada iniciada con éxito!");
      setTimeout(() => {
        router.push(`/jornada?code=${code}`);
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error de conexión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      startDay();
    }
  };

  // Mostrar pantalla de carga mientras se verifica si hay jornada activa
  if (isCheckingActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Clock className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-gray-600 text-lg">Verificando jornada activa...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-linear-to-br from-blue-50 via-white to-purple-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-r from-blue-600 to-purple-600 rounded-full mb-4"
          >
            <Clock className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Sistema de Jornada Laboral
          </h1>
          <p className="text-gray-600 text-lg">
            Control eficiente de tu tiempo de trabajo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Identificación</CardTitle>
                <CardDescription>
                  Ingresa tu código único para comenzar
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Play className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Inicio Rápido</CardTitle>
                <CardDescription>
                  Un clic para iniciar tu jornada
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Tiempo Real</CardTitle>
                <CardDescription>
                  Seguimiento preciso de tus horas
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="max-w-md mx-auto"
        >
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">Iniciar Jornada</CardTitle>
              <CardDescription>Registra tu entrada al trabajo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium">
                  Código del Trabajador
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="code"
                    placeholder="Ej: EMP001"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 h-12 text-lg"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                onClick={startDay}
                disabled={isLoading || !code.trim()}
                className="w-full h-12 text-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 cursor-pointer"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Clock className="w-5 h-5 mr-2" />
                  </motion.div>
                ) : (
                  <Play className="w-5 h-5 mr-2" />
                )}
                {isLoading ? "Iniciando..." : "Iniciar Jornada"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1 text-green-600" />
              <span>Seguro</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1 text-blue-600" />
              <span>Eficiente</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-purple-600" />
              <span>Preciso</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
