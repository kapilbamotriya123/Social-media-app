import { NextApiRequest, NextApiResponse } from 'next';
import { lucia, validateRequest } from '@/auth';
import { cookies } from 'next/headers';

const logout = async (req: NextApiRequest, res: NextApiResponse) => {
  const { session } = await validateRequest();

  if (!session) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  res.status(200).json({ message: 'Logged out successfully' });
};

export default logout;
