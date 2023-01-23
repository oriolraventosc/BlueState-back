interface Contact {
  name: string;
  email: string;
  telephone: number;
  sector: string;
  website: string;
  service: string;
  logo?: string;
  backUpLogo?: string;
}

const pagination = (
  array: Contact[],
  pageSize: number,
  pageNumber: number
): Contact[] => array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

export default pagination;
