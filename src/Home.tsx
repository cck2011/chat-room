import { Rooms } from "./Rooms"
import { UserList } from "./UserList"

export const Home = (()=>{
    return (<div className="p-4">
    <div className="container mx-auto p-4 flex flex-col">
      <Rooms/>
      <UserList/>
    </div>
  </div>)
})