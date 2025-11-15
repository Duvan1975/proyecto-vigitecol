/*import React from 'react'
import { useState } from 'react'

export function Cloudinary({ empleadoId, onFotoSubida }) {
    const preset_name = "vigitecol_empleados";
    const cloud_name = "drlqmol4c";
    
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);

    const uploadImage = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', preset_name);

        setLoading(true);

        try {
            // Subir a Cloudinary
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                method: 'POST',
                body: data
            });

            if (!response.ok) {
                throw new Error('Error en la subida a Cloudinary');
            }

            const file = await response.json();
            setImage(file.secure_url);
            
            // Guardar en tu backend
            if (empleadoId && onFotoSubida) {
                await onFotoSubida(empleadoId, file.secure_url);
            }

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error al subir la imagen: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <input 
                type="file"
                name="file"
                accept="image/*"
                onChange={uploadImage}
                disabled={loading}
            />
            {loading && <div style={{ marginTop: '10px' }}>Subiendo imagen...</div>}
        </div>
    );
}*/