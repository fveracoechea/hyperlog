import { Link, useNavigate } from 'react-router';

import { UndoIcon } from 'lucide-react';

import { Button } from './ui/button';

export function GoBackButton() {
  const navigate = useNavigate();
  return (
    <Button asChild variant="ghost" size="sm" className="w-fit">
      <Link
        to="/"
        onClick={e => {
          e.preventDefault();
          navigate(-1);
        }}
      >
        <UndoIcon /> Go Back
      </Link>
    </Button>
  );
}
