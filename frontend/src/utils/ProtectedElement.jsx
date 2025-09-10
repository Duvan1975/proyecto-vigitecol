
/**
 * Componente que muestra elementos solo a usuarios con los roles especificados
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Elementos a mostrar si tiene permisos
 * @param {Array} props.allowedRoles - Roles que tienen acceso al elemento
 * @returns {ReactNode} Elementos hijos si tiene permisos, null si no
 */
const ProtectedElement = ({ children, allowedRoles }) => {
    // Obtener el rol del usuario desde localStorage
    const userRol = localStorage.getItem("rol");
    
    // Verificar si el usuario tiene uno de los roles permitidos
    const hasAccess = allowedRoles.includes(userRol);
    
    // Si no tiene acceso, no renderizar nada
    if (!hasAccess) {
        return null;
    }
    
    // Si tiene acceso, renderizar los children
    return children;
};

export default ProtectedElement;