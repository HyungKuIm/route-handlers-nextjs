import DogForm from "../DogForm";

export default function NewDogPage() {
  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Dog 등록</h1>
      <DogForm />
    </div>
  );
}
