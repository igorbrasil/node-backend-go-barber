// import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the appointmentson a especific day', async () => {
    const appoinment01 = await fakeAppointmentsRepository.create({
      provider_id: 'provider-id',
      user_id: 'client-id',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });
    const appoinment02 = await fakeAppointmentsRepository.create({
      provider_id: 'provider-id',
      user_id: 'client-id',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    // jest.spyOn(Date, 'now').mockImplementationOnce(() => {
    //   return new Date(2020, 4, 20, 11).getTime();
    // });

    const availability = await listProviderAppointments.execute({
      provider_id: 'provider-id',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(availability).toEqual([appoinment01, appoinment02]);
  });
});
