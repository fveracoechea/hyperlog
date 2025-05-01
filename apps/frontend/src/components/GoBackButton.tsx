import { Link, type To, useNavigate } from 'react-router';

import { UndoIcon } from 'lucide-react';

import { Button } from './ui/button';

export function GoBackButton(props: { replace?: boolean; to?: To }) {
  const navigate = useNavigate();
  return (
    <Button asChild variant='outline' size='sm' className='w-fit'>
      <Link
        to={props.to ?? '/'}
        replace={props.replace}
        onClick={(e) => {
          if (!props.to) {
            e.preventDefault();
            navigate(-1);
          }
        }}
      >
        <UndoIcon /> Go Back
      </Link>
    </Button>
  );
}
