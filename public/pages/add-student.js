import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AddStudent() {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [lrn, setLrn] = useState('');
  const [status, setStatus] = useState('Single');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [schoolLevel, setSchoolLevel] = useState('Elementary');
  const [picture, setPicture] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload picture to Supabase Storage
    let pictureUrl = '';
    if (picture) {
      const { data, error } = await supabase.storage
        .from('student-pictures')
        .upload(`students/${picture.name}`, picture);

      if (error) {
        console.error('Error uploading picture:', error);
        return;
      }

      pictureUrl = supabase.storage
        .from('student-pictures')
        .getPublicUrl(data.path).data.publicUrl;
    }

    // Insert student record
    const { error } = await supabase.from('students').insert([
      {
        name,
        birthday,
        lrn,
        status,
        age,
        address,
        contact_number: contactNumber,
        school_level: schoolLevel,
        picture_url: pictureUrl,
      },
    ]);

    if (error) {
      console.error('Error adding student:', error);
    } else {
      alert('Student added successfully!');
      // Reset form
      setName('');
      setBirthday(new Date());
      setLrn('');
      setStatus('Single');
      setAge('');
      setAddress('');
      setContactNumber('');
      setSchoolLevel('Elementary');
      setPicture(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <DatePicker
        selected={birthday}
        onChange={(date) => setBirthday(date)}
        dateFormat="yyyy-MM-dd"
        required
      />
      <input
        type="text"
        placeholder="LRN"
        value={lrn}
        onChange={(e) => setLrn(e.target.value)}
        required
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Single">Single</option>
        <option value="Married">Married</option>
        <option value="Widow">Widow</option>
      </select>
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Contact Number"
        value={contactNumber}
        onChange={(e) => setContactNumber(e.target.value)}
        required
      />
      <select
        value={schoolLevel}
        onChange={(e) => setSchoolLevel(e.target.value)}
      >
        <option value="Elementary">Elementary</option>
        <option value="High School">High School</option>
      </select>
      <input
        type="file"
        onChange={(e) => setPicture(e.target.files[0])}
      />
      <button type="submit">Add Student</button>
    </form>
  );
}