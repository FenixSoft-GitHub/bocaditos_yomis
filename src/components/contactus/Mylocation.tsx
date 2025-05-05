const Maps_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d245.79113143385192!2d-63.250138659655406!3d9.710193120813134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c3339bfcd5c746f%3A0x46c90fe72b44dc39!2sFenix%20Software%20-%20Software%20Developers!5e0!3m2!1ses!2sve!4v1744552103317!5m2!1ses!2sve"

export const Mylocation = () => {
    return (
        <div>
            <div className='container px-4 justify-center max-w-[800px] mx-auto my-8 text-choco dark:text-cream'>
                <h2 className="text-3xl font-bold text-center mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
                    Nuestra Ubicación
                </h2>
                <div className="overflow-hidden rounded-lg shadow-md border border-gray-200 dark:border-gray-700 ">
                    <iframe
                        src={Maps_EMBED_URL}
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Mapa de ubicación de Fenix Technology"
                    ></iframe>
                </div>
            </div>
        </div>
    )
}
