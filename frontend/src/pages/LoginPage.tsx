import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { loginService } from "@/services/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const user = await loginService(email);

    if (user) {
      if (user.password === password) {
        
        if (user.type !== "ADMIN") {
            setError("Acesso negado. Apenas administradores podem entrar.");
            return;
        }

        login(user);
        navigate("/admin/events");
      } else {
        setError("Senha incorreta.");
      }
    } else {
      setError("Usuário não encontrado.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
      <CardHeader className="border-b mb-5">
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="size-4 text-muted-foreground" />
            <h2 className="text-base font-semibold">Acesso Administrativo</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full">Entrar</Button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-4">
            Esse é um sistema privado. Caso não tenha acesso, contate o administrador.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}