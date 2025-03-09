import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchStudents();
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth/login');
    }
  };

  const fetchStudents = async () => {
    const { data, error } = await supabase.from('students').select('*');
    if (error) {
      console.error('Error fetching students:', error);
    } else {
      setStudents(data);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            <img src={student.picture_url} alt={student.name} width="50" />
            {student.name} - {student.school_level}
          </li>
        ))}
      </ul>
    </div>
  );
}