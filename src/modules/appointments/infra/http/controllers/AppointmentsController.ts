import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmenetService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);

    const createAppointmenetService = container.resolve(
      CreateAppointmenetService,
    );
    const appointment = await createAppointmenetService.execute({
      provider_id,
      date: parsedDate,
    });

    return response.json(appointment);
  }
}
