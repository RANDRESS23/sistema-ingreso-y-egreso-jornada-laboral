"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  Clock,
  Square,
  TrendingUp,
  User,
  Timer,
  Award,
  Coffee,
  Target,
} from "lucide-react";

export default function JornadaPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Cargar jornada activa
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/active/${code}`);
        const data = await res.json();

        if (data.active) {
          setStartTime(new Date(data.active.startTime));
          toast.success("Jornada activa encontrada");
        } else {
          toast.error("No hay jornada activa");
          router.push("/");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error al cargar jornada");
        router.push("/");
      }
    }
    load();
  }, [code, router]);

  // Cronómetro
  useEffect(() => {
    if (!startTime || finished) return;

    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime.getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, finished]);

  const endDay = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error al finalizar jornada");
        return;
      }

      setFinished(true);

      // Celebración con confetti
      await confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      toast.success("¡Jornada finalizada! ¡Buen trabajo!");

      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.log(error);
      toast.error("Error de conexión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const format = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const formatHours = (ms: number) => {
    const hours = ms / (1000 * 60 * 60);
    return hours.toFixed(2);
  };

  const getProgressPercentage = () => {
    const standardWorkHours = 8; // 8 horas estándar
    const currentHours = elapsed / (1000 * 60 * 60);
    return Math.min((currentHours / standardWorkHours) * 100, 100);
  };

  const getMotivationalMessage = () => {
    const hours = elapsed / (1000 * 60 * 60);
    if (hours < 2) return "¡Buen comienzo! Sigue así.";
    if (hours < 4) return "Mitad del camino bien recorrido.";
    if (hours < 6) return "¡Gran progreso! Casi ahí.";
    if (hours < 8) return "¡Excelente trabajo! Finalizando.";
    return "¡Súper estrella! Has superado las 8 horas.";
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-green-600 to-blue-600 rounded-full mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Jornada Activa
          </h1>
          <p className="text-gray-600">{getCurrentDate()}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Trabajador</CardTitle>
                <CardDescription className="font-mono text-lg">
                  {code}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Timer className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Tiempo Total</CardTitle>
                <CardDescription className="font-mono text-lg">
                  {formatHours(elapsed)} horas
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Progreso</CardTitle>
                <CardDescription className="font-mono text-lg">
                  {getProgressPercentage().toFixed(0)}%
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="text-center bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 -mt-8">
              <CardTitle className="text-2xl">Cronómetro de Jornada</CardTitle>
              <CardDescription className="text-blue-100">
                Tiempo transcurrido hoy
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {startTime && !finished && (
                <div className="text-center">
                  <motion.div
                    key={elapsed}
                    className="text-6xl font-mono font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
                  >
                    {format(elapsed)}
                  </motion.div>

                  <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <motion.div
                        className="h-full bg-linear-to-r from-blue-600 to-purple-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgressPercentage()}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {getMotivationalMessage()}
                    </p>
                  </div>
                </div>
              )}

              {finished && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Award className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">
                    ¡Jornada Finalizada!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Tiempo total: {format(elapsed)}
                  </p>
                  <p className="text-lg font-semibold">¡Buen trabajo!</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {!finished && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center"
          >
            <Button
              onClick={endDay}
              disabled={isLoading}
              className="h-14 px-8 text-lg bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 transition-all duration-200 cursor-pointer"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="w-5 h-5 mr-2" />
                </motion.div>
              ) : (
                <Square className="w-5 h-5 mr-2" />
              )}
              {isLoading ? "Finalizando..." : "Terminar Jornada"}
            </Button>

            <p className="text-sm text-gray-500 mt-4">
              Presiona este botón cuando hayas terminado tu jornada laboral
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
