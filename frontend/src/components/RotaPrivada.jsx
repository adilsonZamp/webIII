import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function RotaPrivada({children, perfilNecessario}) {
    const {usuario} = useAuth();//undefined
    console.log("USUARIO:::"+usuario);
    
    if (!usuario) {
        return <Navigate to="/login" replace />
    }

    if (perfilNecessario && usuario.perfil !== perfilNecessario) {
        return <Navigate to="/sem-permissao" replace />
    }

    return children;
}

export default RotaPrivada;