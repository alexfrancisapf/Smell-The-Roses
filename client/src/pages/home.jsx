import { Link } from "react-router-dom"

const home = () => {
  return (
    <>
      <div>home</div>
      <Link to="/trip">trip </Link>
      <Link to="/user">user</Link>
    </>
  )
}

export default home