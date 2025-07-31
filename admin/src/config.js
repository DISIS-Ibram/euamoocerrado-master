
//LETODO - verificar o tamnnho do leaflet aqui
import L from 'leaflet';

var iconbase =  { shadowUrl: '/images/mark-relatos-shadow.svg',
                          
                  iconSize: [45, 56],
                  iconAnchor: [22, 56],

                  shadowSize:   [51, 32],
                  shadowAnchor: [7, 28],

                  popupAnchor: [22, -60],
                }



export const markersMap = function(name = "generico",properties){
            if(name=="registro"){ 
        
                return L.icon({
                        iconUrl: `${window.SI3CONFIG.url}obtericone/?cor=${properties.cor.replace(/#/,'%23')}`,
                          ...iconbase
                })

            }else{
                return L.icon({
                        iconUrl: `/images/mark-${name}.svg`,
                          ...iconbase
                })
            
            }
}

export const markers = {

        relato:L.icon({
                iconUrl: '/images/mark-relatos.svg',
                    ...iconbase
            }),

        registro: L.icon({
                iconUrl: '/images/mark-registros.svg',
                ...iconbase
            }),

        fpe: L.icon({
                iconUrl: '/images/mark-fpe.svg',
            ...iconbase
            }),
            avistamento : L.icon({
                iconUrl: '/images/mark-avistamento.svg',
            ...iconbase
            }),
            sitio : L.icon({
                iconUrl: '/images/mark-sitio.svg',
            ...iconbase
            }),
        vestigio : L.icon({
                iconUrl: '/images/mark-vestigio.svg',
            ...iconbase
            }),
            
        aldeia : L.icon({
                iconUrl: '/images/mark-vestigio.svg',
            ...iconbase
            }),
            

        generico : L.icon({
                iconUrl: '/images/mark-generico.svg',
                ...iconbase
            }),
}
