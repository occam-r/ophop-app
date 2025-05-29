import { H } from "./hereWeGo"
import ORGANIZATION_ICONS from "./OrganizationIcon/OrganizationIcon"



const ShopMarker = ({ lat, lng, img, isInCurrentRoute, routingIsActive, organizationIcon, shopId, handleClick }) => {
    const icon = new H.map.DomIcon(
      ORGANIZATION_ICONS[organizationIcon]
    )
  
    /*
    const icon = new H.map.DomIcon(
      defineIcon(isInCurrentRoute, routingIsActive, img)
    )
    */
  
    const tapEvent = (evt) => {
      handleClick(shopId)
    }
  
    const marker = new H.map.DomMarker({ lat, lng }, { icon })
    marker.addEventListener('tap', tapEvent)
    return marker
  }
  
  export default ShopMarker
  