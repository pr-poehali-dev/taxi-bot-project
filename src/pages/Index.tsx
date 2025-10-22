import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const Index = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const tariffs = [
    {
      name: 'Эконом',
      price: '150₽',
      description: 'Комфортная поездка по доступной цене',
      icon: 'Car',
      features: ['Стандартный автомобиль', 'Опытный водитель', 'Оплата картой']
    },
    {
      name: 'Комфорт',
      price: '250₽',
      description: 'Повышенный комфорт и просторный салон',
      icon: 'Car',
      features: ['Премиум автомобиль', 'Кондиционер', 'Wi-Fi в салоне']
    },
    {
      name: 'Бизнес',
      price: '450₽',
      description: 'Представительский класс для важных встреч',
      icon: 'Briefcase',
      features: ['Автомобили класса люкс', 'VIP-сервис', 'Персональный водитель']
    }
  ];

  const getLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPickupLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          toast.success('Местоположение определено!');
          setIsLocating(false);
        },
        (error) => {
          toast.error('Не удалось определить местоположение');
          setIsLocating(false);
        }
      );
    } else {
      toast.error('Геолокация не поддерживается вашим браузером');
      setIsLocating(false);
    }
  };

  const calculatePrice = () => {
    if (pickupLocation && destination) {
      const randomPrice = Math.floor(Math.random() * 300) + 150;
      setEstimatedPrice(randomPrice);
    }
  };

  useEffect(() => {
    calculatePrice();
  }, [pickupLocation, destination]);

  const handleOrderTaxi = () => {
    if (!pickupLocation || !destination) {
      toast.error('Укажите адрес подачи и пункт назначения');
      return;
    }
    toast.success('Заказ оформлен! Водитель прибудет через 5 минут');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary">
      <header className="bg-black text-white py-4 px-6 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Zap" size={32} className="text-primary" />
            <h1 className="text-2xl font-heading font-bold">TAXI BOT</h1>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#order" className="hover:text-primary transition-colors">Заказ</a>
            <a href="#tariffs" className="hover:text-primary transition-colors">Тарифы</a>
            <a href="#drivers" className="hover:text-primary transition-colors">Водителям</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <section className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-heading font-bold mb-4">
            Ваша поездка,
            <span className="text-primary"> По Требованию</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Быстрое такси в любую точку города. Автоматическое определение местоположения и прозрачные цены
          </p>
          <Button size="lg" className="text-lg px-8 py-6 animate-pulse-slow" onClick={() => document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })}>
            <Icon name="MapPin" className="mr-2" size={20} />
            Заказать такси сейчас
          </Button>
        </section>

        <section id="order" className="mb-16 animate-scale-in">
          <Card className="max-w-2xl mx-auto shadow-xl border-2">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle className="text-3xl font-heading">Заказ такси</CardTitle>
              <CardDescription>Укажите маршрут и получите мгновенную оценку стоимости</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="pickup" className="text-lg">Откуда</Label>
                <div className="flex gap-2">
                  <Input
                    id="pickup"
                    placeholder="Адрес подачи"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="text-lg py-6"
                  />
                  <Button
                    onClick={getLocation}
                    disabled={isLocating}
                    variant="outline"
                    size="lg"
                    className="px-4"
                  >
                    <Icon name={isLocating ? 'Loader2' : 'MapPin'} size={20} className={isLocating ? 'animate-spin' : ''} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination" className="text-lg">Куда</Label>
                <Input
                  id="destination"
                  placeholder="Пункт назначения"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="text-lg py-6"
                />
              </div>

              {estimatedPrice && (
                <div className="bg-primary/10 p-6 rounded-lg animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Ориентировочная стоимость</p>
                      <p className="text-4xl font-bold font-heading">{estimatedPrice}₽</p>
                    </div>
                    <Icon name="Banknote" size={48} className="text-primary" />
                  </div>
                </div>
              )}

              <Button onClick={handleOrderTaxi} size="lg" className="w-full text-lg py-6">
                <Icon name="Car" className="mr-2" size={24} />
                Подтвердить заказ
              </Button>
            </CardContent>
          </Card>
        </section>

        <section id="tariffs" className="mb-16">
          <h2 className="text-4xl font-heading font-bold text-center mb-12">Тарифы и цены</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tariffs.map((tariff, index) => (
              <Card
                key={index}
                className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Icon name={tariff.icon as any} size={32} className="text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-heading">{tariff.name}</CardTitle>
                  <div className="text-4xl font-bold text-primary my-2">{tariff.price}</div>
                  <CardDescription className="text-base">{tariff.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tariff.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Icon name="Check" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="drivers" className="mb-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-heading mb-4">Информация для водителей</CardTitle>
              <CardDescription className="text-lg">
                Присоединяйтесь к нашей команде и начните зарабатывать уже сегодня
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary rounded-full p-3">
                    <Icon name="TrendingUp" size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl mb-1">Высокий доход</h3>
                    <p className="text-muted-foreground">Зарабатывайте до 5000₽ в день</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary rounded-full p-3">
                    <Icon name="Calendar" size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl mb-1">Гибкий график</h3>
                    <p className="text-muted-foreground">Работайте когда удобно вам</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary rounded-full p-3">
                    <Icon name="Shield" size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl mb-1">Поддержка 24/7</h3>
                    <p className="text-muted-foreground">Всегда готовы помочь</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary rounded-full p-3">
                    <Icon name="Zap" size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl mb-1">Быстрые выплаты</h3>
                    <p className="text-muted-foreground">Вывод средств каждый день</p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 text-center mt-4">
                <Button size="lg" className="text-lg px-8 py-6">
                  <Icon name="UserPlus" className="mr-2" size={24} />
                  Стать водителем
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="bg-black text-white py-8 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="Zap" size={28} className="text-primary" />
            <span className="text-xl font-heading font-bold">TAXI BOT</span>
          </div>
          <p className="text-muted-foreground">© 2025 Taxi Bot. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
