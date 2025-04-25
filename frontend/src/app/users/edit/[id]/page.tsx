import { EditProfile } from '@/components/users/EditProfile';
import { Header } from '@/components/common/Header';

type ProfilePageProps = {
    params: { id: string };
  };

export default function Page({ params }: { params: { id: string } }) {
  return (
      <div>
        <Header />
        <EditProfile params={params}/>
        </div> 
        );
}