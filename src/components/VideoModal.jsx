import { ExternalLink } from 'lucide-react';
import { Modal } from './ui';
import { getYouTubeId, youtubeEmbed, youtubeWatch } from '../utils/youtube';

/** Reproduce el video de YouTube de un ejercicio. Se adapta al ancho del celular. */
export default function VideoModal({ ejercicio, onClose }) {
  const id = getYouTubeId(ejercicio.imagen_url);
  return (
    <Modal title={ejercicio.nombre} onClose={onClose} wide>
      {id ? (
        <>
          <div className="aspect-video w-full overflow-hidden rounded-md bg-black">
            <iframe
              className="h-full w-full"
              src={youtubeEmbed(id)}
              title={`Video: ${ejercicio.nombre}`}
              allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <a
            href={youtubeWatch(id)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-plate-bluelight hover:underline"
          >
            <ExternalLink size={14} /> Abrir en YouTube
          </a>
        </>
      ) : (
        <p className="text-sm text-mute">El link de video de este ejercicio no es válido.</p>
      )}
      {ejercicio.descripcion && <p className="mt-4 text-sm text-mute">{ejercicio.descripcion}</p>}
    </Modal>
  );
}
