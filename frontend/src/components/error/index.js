import NotFound from "./NotFound";
import LoadError from "./LoadError";
import BadRequest from "./BadRequest";
import ServerError from "./ServerError";
import PermissionDenied from "./PermissionDenied";

const Error = ({code, onReload}) => {
  console.log(code)
  if (code === 404) {
    return <NotFound/>
  }
  if (code === 'load') {
    return <LoadError reload={onReload}/>
  }
  if (code === 400) {
    return <BadRequest/>
  }
  if (code === 403) {
    return <PermissionDenied/>
  }
  return <ServerError/>
}

export default Error