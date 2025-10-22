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
  const [orderActive, setOrderActive] = useState(false);
  const [driverLocation, setDriverLocation] = useState({ lat: 55.7558, lng: 37.6173 });
  const [estimatedTime, setEstimatedTime] = useState(5);



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
    setOrderActive(true);
    toast.success('Заказ оформлен! Водитель выезжает к вам');
  };

  useEffect(() => {
    if (!orderActive) return;

    const interval = setInterval(() => {
      setDriverLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.002,
        lng: prev.lng + (Math.random() - 0.5) * 0.002
      }));
      
      setEstimatedTime(prev => {
        const newTime = Math.max(0, prev - 0.5);
        if (newTime === 0) {
          clearInterval(interval);
          toast.success('Водитель прибыл!');
        }
        return newTime;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [orderActive]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <header className="bg-white/80 backdrop-blur-md text-foreground py-5 px-6 sticky top-0 z-50 shadow-sm border-b border-border">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-2xl">
              <Icon name="Car" size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">TAXI BOT</h1>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#order" className="hover:text-primary transition-colors font-medium">Заказ такси</a>
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
          <Button size="lg" className="text-lg px-8 py-6 animate-pulse-slow shadow-lg hover:shadow-xl" onClick={() => document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })}>
            <Icon name="MapPin" className="mr-2" size={20} />
            Заказать такси сейчас
          </Button>
        </section>

        <section id="order" className="mb-16 animate-scale-in">
          <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <Card className="shadow-2xl border-none overflow-hidden h-fit">
            <CardHeader className="bg-gradient-to-r from-primary/20 to-accent/20">
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
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-6 rounded-3xl animate-fade-in shadow-inner">
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

          {orderActive && (
            <Card className="shadow-2xl border-none overflow-hidden h-fit animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-primary/20 to-accent/20">
                <CardTitle className="text-2xl font-heading flex items-center gap-2">
                  <Icon name="MapPinned" size={28} className="text-primary" />
                  Отслеживание машины
                </CardTitle>
                <CardDescription>Водитель едет к вам</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative w-full h-80 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#999" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>
                  
                  <div 
                    className="absolute w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg animate-pulse transition-all duration-1000 ease-in-out"
                    style={{
                      left: `${50 + (driverLocation.lng - 37.6173) * 5000}%`,
                      top: `${50 - (driverLocation.lat - 55.7558) * 5000}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <Icon name="Car" size={24} className="text-white" />
                  </div>

                  <div 
                    className="absolute w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <Icon name="MapPin" size={20} className="text-white" />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl">
                          <Icon name="Clock" size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Примерное время прибытия</p>
                          <p className="text-2xl font-bold font-heading">{Math.ceil(estimatedTime)} мин</p>
                        </div>
                      </div>
                      <div className="bg-primary/10 px-4 py-2 rounded-full">
                        <p className="text-sm font-medium text-primary">В пути</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-2xl">
                    <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl">
                      <Icon name="User" size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-heading font-bold text-lg">Иван Петров</p>
                      <p className="text-sm text-muted-foreground">Водитель</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Star" size={16} className="text-primary fill-primary" />
                      <span className="font-bold">4.9</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-2xl">
                    <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl">
                      <Icon name="Car" size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-heading font-bold text-lg">Toyota Camry</p>
                      <p className="text-sm text-muted-foreground">Белый • А123БВ777</p>
                    </div>
                  </div>

                  <Button size="lg" variant="outline" className="w-full">
                    <Icon name="Phone" className="mr-2" size={20} />
                    Позвонить водителю
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          </div>
        </section>


      </main>

      <footer className="bg-gradient-to-r from-primary/90 to-accent/90 text-white py-8 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-2xl">
              <Icon name="Car" size={28} className="text-white" />
            </div>
            <span className="text-xl font-heading font-bold">TAXI BOT</span>
          </div>
          <p className="text-white/80">© 2025 Taxi Bot. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;