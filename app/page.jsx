// import { Counter } from '../components/Counter';
import { getCounterValue } from './actions';
import { Counter} from '../components/counter/Counter';


export default async function Home() {
  const initialValue = await getCounterValue();


  return (
    <main className="home">
      <Counter initialValue={initialValue} />
    </main>
  )
}
