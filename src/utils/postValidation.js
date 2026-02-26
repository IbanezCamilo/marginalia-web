

export const validatePost = (post, initialStatus) => {
    const errors = [];

    if(initialStatus === "PUBLISHED"){
        if(!post.title?.trim()){
            errors.push("El titulo es obligatorio para publicar");
        }
    }

        if (!post.content?.trim()) {
      errors.push("El contenido es obligatorio para publicar");
    }

    if (!post.categoryId) {
      errors.push("Debes seleccionar una categoría");
    }
    
    // Para DRAFT solo validamos lo mínimo
    if (initialStatus === "DRAFT") {
        if (!post.title?.trim() && !post.content?.trim()) {
            errors.push("Un borrador debe tener al menos título o contenido");
        }
        
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}