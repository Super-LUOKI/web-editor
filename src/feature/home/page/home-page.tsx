import { Link } from "@tanstack/react-router";

import { Button } from "@/component/ui/button";


export function HomePage() {
  return (
    <div className='size-full p-5'>
      <Link to='/editor'>
        <Button>Go to editor</Button>
      </Link>
    </div>
  )
}