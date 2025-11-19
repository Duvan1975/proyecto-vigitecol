const cloudinaryConfig = {
    cloud_name: "dvu4rbdd4",
    upload_preset: "vigitecol_upload"
};

export class CloudinaryService {
    static async uploadImage(archivo) {
        const data = new FormData();
        data.append('file', archivo);
        data.append('upload_preset', cloudinaryConfig.upload_preset);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/image/upload`,
                {
                    method: 'POST',
                    body: data
                }
            );

            if (!response.ok) {
                throw new Error('Error al subir imagen a Cloudinary');
            }

            const result = await response.json();
            return result.secure_url; // Retorna la URL de Cloudinary

        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            throw error;
        }
    }
}