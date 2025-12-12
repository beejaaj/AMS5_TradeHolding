import { EditProfile } from '@/components/users/EditProfile';
import NavBar from '@/components/NavBar';

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-[#0B0E11] pt-20">
      <NavBar />
      <EditProfile id={params.id} />
    </div>
  );
}