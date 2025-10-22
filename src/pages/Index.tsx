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
          <Card className="max-w-2xl mx-auto shadow-2xl border-none overflow-hidden">
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